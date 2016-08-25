# -*- encoding: utf-8 -*-
import unittest

import requests
import json

from cloudGate.common.define import *
from cloudGate.config import *

URL = "http://" + HOST + ":" + PORT 
session = requests.session()

class PluginTest(unittest.TestCase):
    def printJson(self, s):
        b = json.loads(s)
        print json.dumps(b, indent=4)

    def setUp(self):
        pass

    def tearDown(self):
        session.close()

    def test_example(self):
        data = {}
        response = session.post(URL + "", data = json.dumps(data))

        self.printJson(response.text)

    def test_createPlugin(self):
        data = {
            "name":"time-plugin",
            "kind":"",
            "status":"enable",
            "description":"scaling container by time",
            "spec":"""{"key":"value"}"""
        }

        response = session.post(URL + "/plugins", data=json.dumps(data))

        self.policy = json.loads(response)

        # {"plugin":"time-plugin", "error":0}
        self.printJson(response.text)

    def test_listPlugins(self):
        response = session.get(URL + "/plugins?offset=0&limit=20")

        """
        {
            "total":25,
            "plugins":[
                {
                    "name":"time-plugin",
                    "kind":"",
                    "status":"enable",
                    "description":"scaling container by time",
                    "spec":"""{"key":"value"}"""
                },
            ]
        }
        """
        self.printJson(response.text)

    def test_getPluginDetail(self):
        plugin_name = "time-plugin"
        response = session.get(URL + "/plugins/" + plugin_name)

        """
         {
            "name":"time-plugin",
            "kind":"",
            "status":"enable",
            "description":"scaling container by time",
            "spec":"""{"key":"value"}"""
        }
        """
        self.printJson(response.text)

    def test_updatePlugin(self):
        plugin_name = "time-plugin"
        data =  {
            "name":"time-plugin",
            "kind":"",
            "status":"disable",
            "description":"scaling container by time",
            "spec":"""{"key":"value"}"""
        }
        response = session.put(URL + "/plugins/" + plugin_name, data=json.dumps(data))

        """
        {
            "name":"time-plugin",
            "kind":"",
            "status":"disable",
            "description":"scaling container by time",
            "spec":"""{"key":"value"}"""
        }
        """
        self.printJson(response.text)

    def test_setPluginScope(self):
        plugin_name = "time-plugin"
        data = {
            "name":"time-plugin",
            "node-tags":{
                "disk":"ssd",
                "memery":"128G"
            },
            "host-names":[
                "dev-1-107",
                "dev-1-108"
            ]
        }

        response = session.post("%s/plugins/%s/scope" % (URL, plugin_name), data=json.dumps(data))

        """
        {
            "error":0 
        }

        """
        self.printJson(response.text)


    def test_getPluginScope(self):
        plugin_name = "time-plugin"

        response = session.get("%s/plugins/%s/scope" % (URL, plugin_name))

        """
        {
            "name":"time-plugin",
            "node-tags":{
                "disk":"ssd",
                "memery":"128G"
            },
            "host-names":[
                "dev-1-107",
                "dev-1-108"
            ]
        }

        """
        self.printJson(response.text)

    def test_updatePluginScope(self):
        plugin_name = "time-plugin"
        data = {
            "name":"time-plugin",
            "node-tags":{
                "disk":"ssd",
                "CPU":"64"
            },
            "host-names":[
                "dev-1-109",
                "dev-1-110"
            ]
        }

        response = session.put("%s/plugins/%s/scope" % (URL, plugin_name), data=json.dumps(data))

        """
        {
            "name":"time-plugin",
            "node-tags":{
                "disk":"ssd",
                "memery":"128G"
            },
            "host-names":[
                "dev-1-107",
                "dev-1-108"
            ]
        }

        """
        self.printJson(response.text)

    def test_deletePlugin(self):
        plugin_name = "time-plugin"

        response = session.delete(URL + "/plugins/" + plugin_name)

        """
        {
            "error":0
        }

        """
        self.printJson(response.text)



if __name__ == '__main__':
    unittest.main()
