var itemModel = require("../models/item");
var repository = itemModel.ItemRepository;
function createItem(req, res) {
    var userName = req.params.name;
    repository.create({ name: userName }, function (error) {
        if (error) {
            res.send(400);
        }
        else {
            res.send(userName + " created ");
        }
    });
}
exports.createItem = createItem;
function getItem(req, res) {
    var itemId = req.params.ItemId;
    repository.findOne({ Id: itemId }, function (error, user) {
        if (error) {
            res.send(400);
        }
        else {
            res.send("user name " + user.ItemId + " retrieved");
        }
    });
}
exports.getItem = getItem;
//# sourceMappingURL=items.js.map