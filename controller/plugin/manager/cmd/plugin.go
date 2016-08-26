package cmd

import (
	"log"
	"net/http"

	"github.com/emicklei/go-restful"
	"github.com/jinzhu/gorm"
)

type ErrorPluginAlreadyExist struct {
	Code string
	Msg  string
}

type Plugin struct {
	Name        string
	Kind        string
	Status      string
	Description string
	SpecJsonStr string
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
		response.WriteHeaderAndEntity(http.StatusBadRequest, ErrorPluginAlreadyExist{"400", "already exit"})
		return
	}

	response.WriteHeaderAndEntity(http.StatusCreated, p)
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
