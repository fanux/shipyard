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
	"log"

	"github.com/spf13/cobra"
)

var (
	ManagerHost string
	ManagerPort string
)

// startCmd represents the start command
var startCmd = &cobra.Command{
	Use:   "start",
	Short: "start a plugin",
	Long:  `start a plugin`,
	Run: func(cmd *cobra.Command, args []string) {
		// TODO: Work your own magic here
		log.Printf("plugin manager server info %s%s\n", ManagerHost, ManagerPort)
		startCron(ManagerHost, ManagerPort)
		//fmt.Println("start called")
	},
}

func init() {
	RootCmd.AddCommand(startCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// startCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// startCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
	startCmd.Flags().StringVarP(&ManagerHost, "manager-host", "H", "localhost", "the ip address of plugin manager server")
	startCmd.Flags().StringVarP(&ManagerPort, "manager-port", "p", ":8081", "the port of plugin manager server")
}
