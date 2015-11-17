/**
 * Created by Ashtonian on 11/1/15.
 */
import express = require("express");
import mongoose = require("mongoose");
import itemModel = require("../models/item");

import IItem  = itemModel.IItem;
import repository = itemModel.ItemRepository;

export function createItem(req:express.Request, res:express.Response) {
    var userName = req.params.name;

    repository.create({name: userName}, (error) => {
        if (error) {
            res.send(400);
        } else {
            res.send(userName + " created ");
        }
    });
}

export function getItem(req:express.Request, res:express.Response) {
    var itemId = req.params.ItemId;

    repository.findOne({Id: itemId}, (error, user) => {
        if (error) {
            res.send(400);
        } else {
            res.send("user name " + user.ItemId + " retrieved");
        }
    });
}