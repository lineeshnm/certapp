import dbConnect from '../../../utils/dbConnect';
import Cert from '../../../models/Cert';

dbConnect();

export default async (req, res) => {
    // console.log(req.query)
    const {
        query: { ids },
        method
    } = req;

    switch (method) {
        case 'GET':
            try {
                const certs = await Cert.find({_id: {$in: ids.split(',')}});
                // console.log({certs})
                if (!certs) {
                    return res.status(400).json({ success: false });
                }

                res.status(200).json({ success: true, data: certs });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'PUT':
            // console.log(ids.split(','), req.body)
            try {
                Cert.updateMany({_id: {$in: ids.split(',')}}, req.body, {
                    new: true,
                    runValidators: true
                }, (err, doc) => {
                    if (err) {
                        // console.log({err})
                        return res.status(400).json({ success: false , error: err});
                    }
                    // console.log({doc})
                    res.status(200).json({ success: true, data: doc });
                });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        case 'DELETE': 
            try {
                Cert.deleteMany({_id: {$in: ids.split(',')}}, {
                    new: true,
                    runValidators: true
                }, (err) => {
                    if (err) {
                        // console.log({err})
                        return res.status(400).json({ success: false , error: err});
                    }
                    // console.log({doc})
                    res.status(200).json({ success: true });
                });
            } catch (error) {
                res.status(400).json({ success: false });
            }
            break;
        default:
            res.status(400).json({ success: false })
            break;
    }
}