const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function(db) {
    const schema = {
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        password: {
            type: String,
            trim: true,
            required: true
        },
        first_name: {
            type: String,
            trim: true,
            required: true
        },
        last_name: {
            type: String,
            trim: true,
            required: true
        }
    }

    const UserSchema = db.schema(schema);

    UserSchema.pre('save', function(next) {
        this.password = bcrypt.hashSync(this.password, saltRounds);
        next();
    });

    return db.model('User', UserSchema);
}
