package cmd

import (
	"cloudflare/cfssl/log"
	"strings"

	"github.com/emicklei/go-restful"
	"github.com/samalba/dockerclient"
)

type ContainerNumberInfo struct {
	Current     int
	Need        int
	ContainerId string
}

type ScaleResult struct {
	Scaled []string
	Errors []string
}

func initScaleInfo(info map[string]ContainerNumberInfo, scaleApp []ScaleApp) {
	for _, v := range scaleApp {
		info[v.App] = ContainerNumberInfo{Current: 0, Need: v.Number, ContainerId: ""}
	}
}

func releaseContainers(info map[string]ContainerNumberInfo, client *dockerclient.DockerClient) {
	containers, err := client.ListContainers(true, false, "")

	if err != nil {
	}

	for _, c := range containers {
		containerNumberInfo, ok := info[c.Image]
		if !ok {
			continue
		}
		containerNumberInfo.Current++
		if containerNumberInfo.Current > containerNumberInfo.Need {
			// stop container with 5 seconds timeout
			client.StopContainer(c.Id, 5)
			// force remove, delete volume
			client.RemoveContainer(c.Id, true, true)
		}
	}
}

func deployContainers(info map[string]ContainerNumberInfo, client *dockerclient.DockerClient) {
	for _, v := range info {
		if v.Current < v.Need {
			n := v.Need - v.Current
			scaleContainer(v.ContainerId, n, client)
		}
	}
}

func scaleContainer(id string, numInstances int, client *dockerclient.DockerClient) ScaleResult {
	var (
		errChan = make(chan (error))
		resChan = make(chan (string))
		result  = ScaleResult{Scaled: make([]string, 0), Errors: make([]string, 0)}
	)

	// docker client get container info
	containerInfo, err := client.InspectContainer(id)
	if err != nil {
		result.Errors = append(result.Errors, err.Error())
		return result
	}

	for i := 0; i < numInstances; i++ {
		go func(instance int) {
			log.Debugf("scaling: id=%s #=%d", containerInfo.Id, instance)
			config := containerInfo.Config
			// clear hostname to get a newly generated
			config.Hostname = ""
			hostConfig := containerInfo.HostConfig
			config.HostConfig = *hostConfig // sending hostconfig via the Start-endpoint is deprecated starting with docker-engine 1.12
			// using docker client create Container
			id, err := client.CreateContainer(config, "", nil)
			if err != nil {
				errChan <- err
				return
			}
			// using docker client start container
			if err := client.StartContainer(id, hostConfig); err != nil {
				errChan <- err
				return
			}
			resChan <- id
		}(i)
	}

	for i := 0; i < numInstances; i++ {
		select {
		case id := <-resChan:
			result.Scaled = append(result.Scaled, id)
		case err := <-errChan:
			log.Errorf("error scaling container: err=%s", strings.TrimSpace(err.Error()))
			result.Errors = append(result.Errors, strings.TrimSpace(err.Error()))
		}
	}

	return result
}

func (this PluginResource) scaleApp(request *restful.Request,
	response *restful.Response) {

	scaleApp := []ScaleApp{}

	dockerClient, err := dockerclient.NewDockerClient(DockerHost, nil)
	if err != nil {
	}

	err = request.ReadEntity(&scaleApp)
	if err != nil {
	}

	/*
		{
			"ats:latest":{2, 20}
			"hadoop:v1.0":{20, 2}
		}
	*/

	scaleInfo := make(map[string]ContainerNumberInfo)

	initScaleInfo(scaleInfo, scaleApp)

	releaseContainers(scaleInfo, dockerClient)
	deployContainers(scaleInfo, dockerClient)

	//fmt.Println("scale map: ", scaleInfo["ats"])
}
