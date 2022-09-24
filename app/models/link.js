
module.exports = link => {
    const AutoIncrement = require('mongoose-sequence')(link);
    var schema = link.Schema({
        urlId: {type: Number},
        longUrl: {type: String, required: true},
        urlCode: {type: String, required: true, unique: true},
        shortUrl: {type: String, unique: true},
        active: {type: Boolean},
    },
    { timestamps: true }
    );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    schema.plugin(AutoIncrement, {inc_field: 'linkId', id:"linkId_counter"});

    const Link = link.model("links", schema);
    return Link;
}