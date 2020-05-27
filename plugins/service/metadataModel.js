module.exports = function(db) {
    const schema = {
        key: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    }

    const MetadataSchema = db.schema(schema);
    return db.model('Metadata', MetadataSchema);
}
