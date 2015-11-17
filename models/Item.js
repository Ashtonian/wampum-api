var mongoose = require("mongoose");
exports.ItemSchema = new mongoose.Schema({
    name: String,
    ItemId: String,
    Name: String,
    Value: String,
    Location: String
});
exports.ItemRepository = mongoose.model("ItemSchema");
//# sourceMappingURL=item.js.map