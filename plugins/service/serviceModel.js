const mongoose = require('mongoose');

module.exports = function(db, userModel, metadataModel) {
    const schema = {
        owner: {
            type: mongoose.ObjectId,
            required: true,
        },
        service_name: {
            type: String,
            trim: true,
            required: true
        },
        participants: {
            type: [String],
            trim: true,
        },
        plugins: {
            type: [String],
            trim: true,
        },
        meta: [metadataModel.schema]
    }

    const ServiceSchema = db.schema(schema);
    return db.model('Service', ServiceSchema);
}
