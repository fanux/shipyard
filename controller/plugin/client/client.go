package client

import "log"

type Client interface {
	GetPluginInfo(pluginName string) (Plugin, error)
	GetPluginStrategies(pluginName string) ([]Strategy, error)

	/*
		[
			{
				"app":"ats",
				"num":20,
			},
			{
				"app":"hadoop",
				"num":10
			}
		]
	*/
	ScaleApps(appscale []AppScale) error

	// TODO add message listen interface, for example the manager disable or enale plugins
}

func NewClient(host, port string) Client {
	log.Printf("new api client info:%s%s", host, port)
	return Api{host, port}
}
