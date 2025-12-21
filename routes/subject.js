const express = require('express')
const router = express.Router()
const middleware = require('../middleware/middleware')
const Subject = require('../models/Subject')

/**
 * POST /add-subject
 * إضافة مادة جديدة مع الفئات والجدول الزمني
 */
router.post('/add-subject', middleware, async (req, res) => {
    try {
        const { name, hours, doctorName, practicalTeacher, numberOfClasses, classes , sections} = req.body

        // التحقق من البيانات المطلوبة
        if (!name || !hours || !doctorName || !numberOfClasses || !classes || !sections) {
            return res.status(400).json({
                success: false,
                message: 'جميع الحقول المطلوبة يجب أن تكون موجودة'
            })
        }

        // التحقق من عدد الفئات
        if (classes.length !== numberOfClasses) {
            return res.status(400).json({
                success: false,
                message: 'عدد الفئات غير متطابق'
            })
        }

        // التحقق من أن كل فئة تحتوي على بيانات صحيحة
        for (let cls of classes) {
            if (!cls.name || !cls.type) {
                return res.status(400).json({
                    success: false,
                    message: 'كل فئة يجب أن تحتوي على اسم ونوع'
                })
            }
        }

        // إنشاء المادة الجديدة
        const newSubject = new Subject({
            name: name.trim(),
            hours: parseInt(hours),
            doctorName: doctorName.trim(),
            practicalTeacher: practicalTeacher ? practicalTeacher.trim() : '',
            numberOfClasses: parseInt(numberOfClasses),
            sections: sections,
            classes: classes.map(cls => ({
                name: cls.name.trim(),
                type: cls.type,
                schedule: cls.schedule || {}
            }))
        })

        // حفظ المادة في قاعدة البيانات
        const savedSubject = await newSubject.save()

        console.log('✅ تم إضافة المادة بنجاح:', savedSubject)

        return res.status(201).json({
            success: true,
            message: 'تم إضافة المادة بنجاح',
            data: savedSubject
        })

    } catch (error) {
        console.error('❌ خطأ أثناء إضافة المادة:', error.message)
        return res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء إضافة المادة',
            error: error.message
        })
    }
})

/**
 * GET /view-subjects
 * عرض جميع المواد مع نظام الصفحات
 */
router.get('/view-subjects', middleware, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = 10 // عدد المواد في كل صفحة
        const skip = (page - 1) * limit

        // جلب المواد من قاعدة البيانات
        const subjects = await Subject.find()
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 }) // ترتيب تنازلي حسب تاريخ الإنشاء

        // عد إجمالي عدد المواد
        const totalSubjects = await Subject.countDocuments()
        const totalPages = Math.ceil(totalSubjects / limit)

        // التحقق من صحة رقم الصفحة
        if (page > totalPages && totalPages > 0) {
            return res.status(400).json({
                success: false,
                message: 'رقم الصفحة غير صحيح'
            })
        }

        console.log(`✅ تم جلب المواد من الصفحة ${page}:`, subjects.length)

        return res.status(200).json({
            success: true,
            message: 'تم جلب المواد بنجاح',
            data: {
                subjects: subjects,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalSubjects: totalSubjects,
                    limit: limit
                }
            },
            subjects: subjects,
            totalPages: totalPages
        })

    } catch (error) {
        console.error('❌ خطأ أثناء جلب المواد:', error.message)
        return res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب البيانات',
            error: error.message
        })
    }
})

router.get('/subject/:id', middleware, async (req, res) => {
    try {
        const { id } = req.params
        const subject = await Subject.findById(id)

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'المادة غير موجودة'
            })
        }
        console.log('✅ تم جلب بيانات المادة بنجاح:', subject)

        return res.status(200).json({
            success: true,
            message: 'تم جلب بيانات المادة بنجاح',
            data: subject
        })
    } catch (error) {
        console.error('❌ خطأ أثناء جلب بيانات المادة:', error.message)
        return res.status(500).json({
            success: false,
            message: 'حدث خطأ أثناء جلب بيانات المادة',
            error: error.message
        })
    }
})

router.delete('/subject/:id', middleware, async (req, res) => {
    try {
        const { id } = req.params
        const subject = await Subject.findByIdAndDelete(id)
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'المادة غير موجودة'
            })
        }
        console.log('✅ تم حذف المادة بنجاح:', subject)

        return res.status(200).json({'تم حذف المادة بنجاح': true})
    } catch (error) {
        console.error('❌ خطأ أثناء حذف المادة:', error.message)
        return res.status(500).json({'حدث خطأ أثناء حذف المادة': false})
    }
})

router.put('/subject/:id', middleware, async (req, res) => {
    try {
        const { id } = req.params
        const updateData = req.body
        updateData.updatedAt = Date.now()
        const subject = await Subject.findByIdAndUpdate(id, updateData, { new: true })
        if (!subject) {
            return res.status(404).json({'المادة غير موجودة': false})
        }
        console.log('✅ تم تحديث المادة بنجاح:', subject)

        return res.status(200).json({'تم تحديث المادة بنجاح': true, data: subject})
    } catch (error) {
        console.error('❌ خطأ أثناء تحديث المادة:', error.message)
        return res.status(500).json({'حدث خطأ أثناء تحديث المادة': false})
    }
})

module.exports = router