import mongoose = require("mongoose");

export var ItemSchema = new mongoose.Schema({
    name: String,
    ItemId: String,
    Name: String,
    Value: String,
    Location: String
});

export interface IItem extends mongoose.Document{
    ItemId:string;
    Name:string;
    Value:string;
    Location:string;
}

export var ItemRepository = mongoose.model<IItem>("ItemSchema");

