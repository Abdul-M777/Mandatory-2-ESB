import requests
from xml.etree.ElementTree import Element, SubElement, tostring
import logging
import csv
from datetime import datetime
import time


def init():
    #timestr = time.strftime("%Y%m%d-%H%M%S")
    #file = open(timestr + '.txt', 'wb')
    topic = input("Enter a Topic: ")
    message = input("Enter a message: ")
    xmlTag = Element("message")
    topic_child = SubElement(xmlTag, "topic")
    topic_child.text = topic
    child = SubElement(xmlTag, "data")
    child.text = message
    xml_str = tostring(xmlTag)
    xml_decode = xml_str.decode('utf-8')
    print(xml_decode)
    #file.write(xml_str)
    #file.close()
    headers = {'Content-Type': 'application/xml'}
    response = requests.post("http://localhost:8080/todos", data=xml_str, headers=headers)
    print(response)




init()

