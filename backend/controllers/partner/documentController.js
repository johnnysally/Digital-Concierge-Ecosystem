const Document = require('../../models/partner/Document');

const createDocument = async (req, res, next) => {
    try {
        const document = await Document.create({ ...req.body, partner: req.user._id });
        res.status(201).json({ success: true, document });
    } catch (error) {
        next(error);
    }
};

const getDocuments = async (req, res, next) => {
    try {
        const { type, status } = req.query;
        const query = { partner: req.user._id };
        if (type) query.type = type;
        if (status) query.status = status;

        const documents = await Document.find(query).sort({ createdAt: -1 });
        res.json({ success: true, documents });
    } catch (error) {
        next(error);
    }
};

const getDocument = async (req, res, next) => {
    try {
        const document = await Document.findOne({ _id: req.params.id, partner: req.user._id });
        if (!document) return res.status(404).json({ success: false, message: 'Document not found' });
        res.json({ success: true, document });
    } catch (error) {
        next(error);
    }
};

const deleteDocument = async (req, res, next) => {
    try {
        const document = await Document.findOneAndDelete({ _id: req.params.id, partner: req.user._id });
        if (!document) return res.status(404).json({ success: false, message: 'Document not found' });
        res.json({ success: true, message: 'Document deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = { createDocument, getDocuments, getDocument, deleteDocument };