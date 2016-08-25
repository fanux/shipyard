# -*- encoding: utf-8 -*-
import unittest

import requests
import json

from cloudGate.common.define import *
from cloudGate.config import *

URL = "http://" + HOST + ":" + PORT 
session = requests.session()

"""
TODO 后期版本可能对插件优先级，策略优先级等进行定义
"""

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
            "manual":"插件策略文档编写说明书，策略文档各字段含义，编写规则等，markdown格式"
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
            "spec":"""{"key":"value"}""",
            "manual":"插件策略文档编写说明书，策略文档各字段含义，编写规则等，markdown格式"
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
            "manual":"插件策略文档编写说明书，策略文档各字段含义，编写规则等，markdown格式"
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

    def test_createPluginStrategy(self):
        """
        不同的插件策略文档格式差异会非常大, 这里以时间为调度维度作个示例
        新的插件负责定义和解析策略文档并作出相应的动作

        xx_document的格式不定，所有惩罚列表都有一个 name 和 value

        同一个插件的策略文档格式相同，一个插件支持多个策略，仅是参数不同。
        """
        plugin_name = "time-plugin"

        self.document = [
            {    # 0点的时候启动20个ats 10个hadoop，ats通过容器启动，hadoop通过镜像创建新容器
                 # 配置文件为了尽可能简单，暂时可先不支持通过镜像创建，后面可融合Compose
                "time":{
                    "year":None,
                    "month":None,
                    "day":None,
                    "week":None,
                    "day_of_week":None,
                    "hour":0,
                    "minute":None,
                    "second":None
                },
                "apps":[
                    {
                        "type":"container",
                        "name":"ats"
                        "number":20
                    },
                    {
                        "type":"image",
                        "name":"hadoop:latest"
                        "number":10
                    },
                ]
            },
            {
                 "time":{
                    "year":None,
                    "month":None,
                    "day":None,
                    "week":None,
                    "day_of_week":None,
                    "hour":1,
                    "minute":None,
                    "second":None
                },
                "apps":[
                    {
                        "type":"container",
                        "name":"ats"
                        "number":18
                    },
                    {
                        "type":"image",
                        "name":"hadoop:latest"
                        "number":12
                    },
                ]
            },
        ]

        plugin_strategies = {
            "plugin-name":"time-plugin",
            "strategy": {
                "name":"scale-by-hour",
                "status":"disable",
                #对controller来说就是一个字符串，不关心其内容
                "value":json.dumps(self.document) 
            },  #可以添加按分钟伸缩的策略
            
        }

        response = session.post("%s/plugins/%s/strategies" % (URL, plugin_name), 
                data=json.dumps(plugin_strategies))

        """
        {
            "error":0
        }

        """
        self.printJson(response.text)

    def test_getPluginStrategies(self):
        plugin_name = "time-plugin"

        response = session.get("%s/plugins/%s/strategies" % (URL, plugin_name))

        """
        {
            "plugin-name":"time-plugin",
            "strategies":[
                {
                    "name":"scale-by-hour",
                    "status":"enable",
                    "value":json.dumps(self.document) 
                },  
            ]
        }

        """
        self.printJson(response.text)

    def test_getPluginStrategy(self):
        plugin_name = "time-plugin"
        strategy_name = "scale-by-hour"

        response = session.get("%s/plugins/%s/strategies/%s" % (URL, plugin_name, strategy_name))

        """
        {
            "plugin-name":"time-plugin",
            "strategies": {
                "name":"scale-by-hour",
                "status":"enable",
                "value":json.dumps(self.document) 
            } 
        }

        """
        self.printJson(response.text)

    def test_updatePluginStratety(self):
        plugin_name = "time-plugin"
        strategy_name = "scale-by-hour"

        data = {
            "plugin-name":"time-plugin",
            "strategies": {
                "name":"scale-by-hour",
                "status":"disable",
                "value":json.dumps(self.document),
            } 
        }

        response = session.put("%s/plugins/%s/strategies/%s" % (URL, plugin_name, strategy_name),
                data=json.dumps(data))

        """
        {
            "error":0
        }

        """
        self.printJson(response.text)

    def test_deletePluginStrategy(self):
        plugin_name = "time-plugin"
        strategy_name = "scale-by-hour"

        response = session.delete("%s/plugins/%s/strategies/%s" % 
                (URL, plugin_name, strategy_name))

        """
        {
            "error":0
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
