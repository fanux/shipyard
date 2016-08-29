package client

type Plugin struct {
	Name        string
	Kind        string
	Status      string
	Description string
	Spec        string
	Manual      string
}

type Strategy struct {
	//witch plugin strategy belongs to
	PluginName string
	Name       string
	Status     string
	Document   string
}

/*
	define the app name and scale to witch number
*/
type AppScale struct {
	App    string
	Number int
}
