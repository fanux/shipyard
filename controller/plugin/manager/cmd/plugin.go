package cmd

import (
	"log"
	"net/http"

	"github.com/emicklei/go-restful"
	"github.com/jinzhu/gorm"
)

type PluginError struct {
	Code string
	Msg  string
}

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

type PluginResource struct {
	db *gorm.DB
}

type ScaleApp struct {
	App string
	Num int
}

func (p PluginResource) Register(container *restful.Container) {
	ws := new(restful.WebService)

	ws.
		Path("/plugins").
		Doc("Manage plugins").
		Consumes(restful.MIME_JSON).
		Produces(restful.MIME_JSON)

	ws.Route(ws.POST("").To(p.createPlugin).
		Doc("create a plugin").
		Operation("createPlugin").
		Reads(Plugin{}))

	ws.Route(ws.GET("").To(p.listPlugins).
		Doc("list plugins").
		Operation("listPlugins").
		Returns(200, "OK", []Plugin{}))

	ws.Route(ws.GET("/{pluginName}").To(p.getPluginDetail).
		Doc("get plugin detail").
		Operation("getPluginDetail").
		Param(ws.PathParameter("pluginName", "name of plugin").DataType("string")).
		Writes(Plugin{}))

	ws.Route(ws.PUT("/{pluginName}").To(p.updatePlugin).
		Doc("update a plugin").
		Operation("updatePlugin").
		Param(ws.PathParameter("pluginName", "name of plugin").DataType("string")).
		ReturnsError(409, "duplicate user-id", nil).
		Reads(Plugin{}))

	ws.Route(ws.DELETE("/{pluginName}").To(p.deletePlugin).
		Doc("delete plugin").
		Operation("deletePlugin").
		Param(ws.PathParameter("pluginName", "name of plugin").DataType("string")))

	//Plugin strateg
	ws.Route(ws.POST("/{pluginName}/strategies").To(p.createPluginStrategies).
		Doc("create plugin strategies").
		Operation("createPluginStrategies").
		Param(ws.PathParameter("pluginName", "name of plugin").DataType("string")).
		Reads(Strategy{}))

	ws.Route(ws.GET("/{pluginName}/strategies").To(p.listPluginStragies).
		Doc("list plugin strategies").
		Operation("listPluginStragies").
		Param(ws.PathParameter("pluginName", "name of plugin").DataType("string")).
		Returns(200, "OK", []Strategy{}))

	ws.Route(ws.GET("/{pluginName}/strategies/{strategyName}").
		To(p.getPluginStrategyDetail).
		Doc("get strategy detail").
		Operation("getStrategy").
		Param(ws.PathParameter("pluginName", "name of plugin").DataType("string")).
		Param(ws.PathParameter("strategyName", "name of strategy").DataType("string")).
		Writes(Strategy{}))

	ws.Route(ws.PUT("/{pluginName}/strategies/{strategyName}").
		To(p.updatePluginStrategy).
		Doc("update a plugin strategy").
		Operation("updatePluginStrategy").
		Param(ws.PathParameter("pluginName", "name of plugin").DataType("string")).
		Param(ws.PathParameter("StrategyName", "name of plugin strategy").DataType("string")).
		ReturnsError(409, "duplicate strategy id", nil).
		Reads(Strategy{}))

	ws.Route(ws.DELETE("/{pluginName}/strategies/{strategyName}").
		To(p.deletePluginStrategy).
		Doc("delete plugin strategy").
		Operation("deletePluginStrategy").
		Param(ws.PathParameter("pluginName", "name of plugin").DataType("string")).
		Param(ws.PathParameter("strategyName", "name of plugin strategy").DataType("string")))

	ws.Route(ws.POST("/scale").To(p.scaleApp).
		Doc("scale app").
		Operation("scaleApp").
		Reads([]ScaleApp{}))

	container.Add(ws)
}

func (this PluginResource) createPlugin(request *restful.Request, response *restful.Response) {
	p := new(Plugin)
	res := Plugin{Name: ""}

	err := request.ReadEntity(p)

	if err != nil {
		response.AddHeader("Content-Type", "text/plain")
		response.WriteErrorString(http.StatusInternalServerError, err.Error())
		return
	}

	//query result will write to res, if already exist res.Name will change
	//then quit the insert action
	if this.db.Where("name = ?", p.Name).First(&res); res.Name == "" {
		this.db.NewRecord(p)
		this.db.Create(&p)
	} else {
		log.Printf("plugin %s already exist", p.Name)
		response.WriteHeaderAndEntity(http.StatusBadRequest, PluginError{"400", "already exit"})
		return
	}

	response.WriteHeaderAndEntity(http.StatusCreated, p)
}

func (this PluginResource) listPlugins(request *restful.Request, response *restful.Response) {
	plugins := []Plugin{}

	this.db.Find(&plugins)

	response.WriteEntity(plugins)
}

func (this PluginResource) getPluginDetail(request *restful.Request,
	response *restful.Response) {

	plugin := Plugin{Name: ""}
	pluginName := request.PathParameter("pluginName")

	this.db.Where("name = ?", pluginName).First(&plugin)
	if plugin.Name != "" {
		response.WriteEntity(plugin)
		return
	}
	response.WriteHeaderAndEntity(http.StatusBadRequest,
		PluginError{"400", "plugin not found"})
}

func (this PluginResource) updatePlugin(request *restful.Request, response *restful.Response) {
	pluginName := request.PathParameter("pluginName")
	plugin := Plugin{}
	tmp := Plugin{}
	err := request.ReadEntity(&plugin)

	//this.db.Where("name = ?", pluginName).Save(&plugin)
	this.db.Where("name = ?", pluginName).First(&tmp)

	if plugin.Status != tmp.Status {
		this.db.Model(&tmp).Update("status", plugin.Status)
	}
	if plugin.Kind != tmp.Kind {
		this.db.Model(&tmp).Update("kind", plugin.Kind)
	}
	if plugin.Description != tmp.Description {
		this.db.Model(&tmp).Update("description", plugin.Description)
	}
	if plugin.Spec != tmp.Spec {
		this.db.Model(&tmp).Update("spec", plugin.Spec)
	}
	if plugin.Manual != tmp.Manual {
		this.db.Model(&tmp).Update("manual", plugin.Manual)
	}

	if err != nil {
		response.AddHeader("Content-type", "text/plain")
		response.WriteErrorString(http.StatusInternalServerError, err.Error())
		return
	}
	response.WriteEntity(tmp)
}

func (this PluginResource) deletePlugin(request *restful.Request, response *restful.Response) {
	pluginName := request.PathParameter("pluginName")

	this.db.Where("name = ?", pluginName).Delete(Plugin{})

	response.WriteHeaderAndEntity(http.StatusOK, PluginError{"0", "delete ok"})
}

func (this PluginResource) createPluginStrategies(request *restful.Request,
	response *restful.Response) {

	//pluginName := request.PathParameter("pluginName")
	strategy := new(Strategy)
	res := Strategy{Name: ""}

	err := request.ReadEntity(strategy)
	if err != nil {
		response.AddHeader("Content-Type", "text/plain")
		response.WriteErrorString(http.StatusInternalServerError, err.Error())
		return
	}

	if this.db.Where("name = ?", strategy.Name).First(&res); res.Name == "" {
		this.db.NewRecord(strategy)
		this.db.Create(&strategy)
	} else {
		log.Printf("plugin %s already exist", strategy.Name)
		response.WriteHeaderAndEntity(http.StatusBadRequest, PluginError{"400", "already exit"})
		return
	}

	response.WriteHeaderAndEntity(http.StatusCreated, strategy)

}

func (this PluginResource) listPluginStragies(request *restful.Request,
	response *restful.Response) {

	strategies := []Strategy{}

	this.db.Find(&strategies)

	response.WriteEntity(strategies)
}

func (this PluginResource) getPluginStrategyDetail(request *restful.Request,
	response *restful.Response) {

	strategy := Strategy{Name: ""}
	strategyName := request.PathParameter("strategyName")

	this.db.Where("name = ?", strategyName).First(&strategy)
	if strategy.Name != "" {
		response.WriteEntity(strategy)
		return
	}
	response.WriteHeaderAndEntity(http.StatusBadRequest,
		PluginError{"400", "plugin strategy not found"})
}

func (this PluginResource) updatePluginStrategy(request *restful.Request,
	response *restful.Response) {

	strategyName := request.PathParameter("strategyName")
	strategy := Strategy{}
	tmp := Strategy{}
	err := request.ReadEntity(&strategy)

	//this.db.Where("name = ?", pluginName).Save(&plugin)
	this.db.Where("name = ?", strategyName).First(&tmp)

	if strategy.Status != tmp.Status {
		this.db.Model(&tmp).Update("status", strategy.Status)
	}
	if strategy.Document != tmp.Document {
		this.db.Model(&tmp).Update("document", strategy.Document)
	}

	if err != nil {
		response.AddHeader("Content-type", "text/plain")
		response.WriteErrorString(http.StatusInternalServerError, err.Error())
		return
	}
	response.WriteEntity(tmp)
}

func (this PluginResource) deletePluginStrategy(request *restful.Request,
	response *restful.Response) {

	strategyName := request.PathParameter("strategyName")

	this.db.Where("name = ?", strategyName).Delete(Strategy{})

	response.WriteHeaderAndEntity(http.StatusOK, PluginError{"0", "delete ok"})
}

func (this PluginResource) scaleApp(request *restful.Request,
	response *restful.Response) {
	//TODO
}

func runServer(host string, port string) {
	wsContainer := restful.NewContainer()

	db := initDB(DBHost, DBPort, DBUser, DBName, DBPasswd)
	defer db.Close()

	p := PluginResource{db}
	p.Register(wsContainer)

	log.Printf("start listening on %s%s", host, port)
	server := &http.Server{Addr: port, Handler: wsContainer}
	log.Fatal(server.ListenAndServe())
}
