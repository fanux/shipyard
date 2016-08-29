package cmd

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/robfig/cron"
	"github.com/shipyard/shipyard/controller/plugin/client"
)

// TODO plugin regist itself or through web add it manual, I think auto regist is better,
// web api just update a plugin info
const PLUGIN_NAME = "plugin_pipeline"

type PipelineRule struct {
	Cron string
	//Apps []client.AppScale
	Apps []client.AppScale
}

type Job struct {
	Client client.Client
	Rule   PipelineRule
}

func (this Job) Run() {
	log.Printf("job info: Cron: [%s]", this.Rule.Cron)
	fmt.Println("time: ", time.Now().Format("2016-01-02 03:04:05 PM"))

	this.Client.ScaleApps(this.Rule.Apps)
}

func startJob(client client.Client, rules []PipelineRule) {
	fmt.Println(rules)

	crontab := cron.New()
	crontab.Start()
	//defer crontab.Stop()

	for _, rule := range rules {
		job := Job{Client: client, Rule: rule}
		fmt.Println("Cron:", job.Rule.Cron)
		crontab.AddFunc(job.Rule.Cron, job.Run)
	}
}

func startCron(host, port string) {
	client := client.NewClient(host, port)
	log.Printf("start cron, plugin name is: %s", PLUGIN_NAME)

	plugin, err := client.GetPluginInfo(PLUGIN_NAME)
	if err != nil {
		log.Printf("load plugin [%s] info error: %s", PLUGIN_NAME, err)
		return
	}

	strategies, err := client.GetPluginStrategies(PLUGIN_NAME)
	if err != nil {
		log.Printf("load plugin [%s] strategies error: %s", PLUGIN_NAME, err)
		return
	}

	// TODO enable disable plugin logic, I think use message bus change plugin
	if plugin.Status != "enable" {
	}

	rules := make([]PipelineRule, 20)

	for _, strategy := range strategies {
		if strategy.Status == "enable" {
			e := json.Unmarshal([]byte(strategy.Document), &rules)
			if e != nil {
				fmt.Println("umarshal error", e)
			}

			startJob(client, rules)
		}
	}

	select {}
}
