package client

import (
	"encoding/json"
	"log"
)

type Api struct {
	host string
	port string
}

func (this Api) GetPluginInfo(pluginName string) (Plugin, error) {
	log.Printf("get plugin info:%s", pluginName)

	p := Plugin{
		Name:        "plugin_pipeline",
		Kind:        "",
		Status:      "enable",
		Description: "",
		Spec:        "",
		Manual:      "",
	}

	return p, nil
}

func (this Api) GetPluginStrategies(pluginName string) ([]Strategy, error) {
	log.Printf("get plugin strategies:%s", pluginName)
	strategies := []Strategy{
		{
			PluginName: "plugin_pipeline",
			Name:       "scale-by-hour",
			Status:     "enable",
			Document:   `[{"Cron":"*/1 * * * * *","Apps":[{"App":"ats","Number":20},{"App":"hadoop","Number":10}]}]`,
		},
	}
	return strategies, nil
}

func (this Api) ScaleApps(appscale []AppScale) error {
	s, _ := json.Marshal(appscale)
	log.Printf("scale apps: \n%s\n", string(s))
	return nil
}
