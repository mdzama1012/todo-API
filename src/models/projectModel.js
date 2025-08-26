const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 100,
            trim: true,
        },
        color: {
            type: String,
            enum: {
                values: [
                    '#FF6666',
                    '#F2A761',
                    '#B5FF66',
                    '#45E6BB',
                    '#47B1B3',
                    '#668FFF',
                    '#B366FF',
                    '#999999',
                ],
            },
            default: '#999999',
        },
        isFavorite: { type: Boolean, default: false },
        coverImageURL: String,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
    },
    { timestamps: true },
);

const projectModel = mongoose.model('projects', projectSchema);

module.exports = projectModel;
