const express = require('express')
const router = express.Router()
const middleware = require('../middleware/middleware')
const Advertisement = require('../models/Advertisement')


router.post('/add-advertisement', middleware, async (req, res) => {
    try {
        const { title, content } = req.body
        // التحقق من البيانات المطلوبة
        if (!title || !content) {
            return res.status(400).json({message: 'جميع الحقول المطلوبة يجب أن تكون موجودة', success: false})
        }

        // إنشاء الإعلان الجديد
        const newAdvertisement = new Advertisement({
            title: title.trim(),
            content: content.trim(),
        })
        // حفظ الإعلان في قاعدة البيانات
        const savedAdvertisement = await newAdvertisement.save()
        console.log('✅ تم إضافة الإعلان بنجاح:', savedAdvertisement)

        return res.status(201).json({
            success: true,
            message: 'تم إضافة الإعلان بنجاح',
            advertisement: savedAdvertisement
        })
    } catch (error) {
        console.error('❌ خطأ في إضافة الإعلان:', error)
        return res.status(500).json({message: 'حدث خطأ في الخادم', success: false})
    }
})

router.get('/advertisements', middleware, async (req, res) => {
    try {
        const advertisements = await Advertisement.find().sort({ createdAt: -1 }) // ترتيب تنازلي حسب تاريخ الإنشاء
        return res.status(200).json({ success: true, advertisements })
    } catch (error) {
        console.error('❌ خطأ في جلب الإعلانات:', error)
        return res.status(500).json({ message: 'حدث خطأ في الخادم', success: false })
    }
})




module.exports = router