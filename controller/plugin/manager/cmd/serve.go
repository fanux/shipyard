// Copyright © 2016 NAME HERE <EMAIL ADDRESS>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

var (
	Host string
	Port string

	DBHost   string
	DBPort   string
	DBUser   string
	DBName   string
	DBPasswd string

	DockerHost string

	AllowedDomain string
)

// serveCmd represents the serve command
var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "start the manager server",
	Long:  `start the manager server`,
	Run: func(cmd *cobra.Command, args []string) {
		// TODO: Work your own magic here
		fmt.Printf("database info host=%s port=%s user=%s name=%s passwd=%s\n",
			DBHost, DBPort, DBUser, DBName, DBPasswd)
		//initDB(DBHost, DBPort, DBUser, DBName, DBPasswd)

		fmt.Println("serve called", Host, Port)
		runServer(Host, Port)
	},
}

func init() {
	RootCmd.AddCommand(serveCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// serveCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// serveCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")

	serveCmd.Flags().StringVarP(&Host, "host", "H", "localhost", "the ip address of manager server")
	serveCmd.Flags().StringVarP(&Port, "port", "p", ":8081", "the port of manager server")

	serveCmd.Flags().StringVarP(&DBHost, "db-host", "d", "localhost", "the address of database server")
	serveCmd.Flags().StringVarP(&DBPort, "db-port", "P", "5432", "the port of database server, default pgsql port is 5432")
	serveCmd.Flags().StringVarP(&DBUser, "db-user", "u", "shipyard", "the user of database server")
	serveCmd.Flags().StringVarP(&DBName, "db-name", "n", "shipyard", "the database name of database server")
	serveCmd.Flags().StringVarP(&DBPasswd, "db-passwd", "w", "111111", "the database passwd")

	serveCmd.Flags().StringVarP(&DockerHost, "docker-host", "s", "http://192.168.96.99:4000", "the docker host")

	serveCmd.Flags().StringVarP(&AllowedDomain, "allowed-domain", "o", "http://192.168.86.170:8888", "manager allowed origin")
}
