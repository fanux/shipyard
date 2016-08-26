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

type PluginResource struct {
	db *gorm.DB
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

func (this PluginResource) getPluginDetail(request *restful.Request, response *restful.Response) {
	plugin := Plugin{Name: ""}
	pluginName := request.PathParameter("pluginName")

	this.db.Where("name = ?", pluginName).First(&plugin)
	if plugin.Name != "" {
		response.WriteEntity(plugin)
		return
	}
	response.WriteHeaderAndEntity(http.StatusBadRequest, PluginError{"400", "plugin not found"})
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
