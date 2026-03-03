// ===================================================================
// MotionBoss LMS - Instructor Service
// Business logic for Instructor CRUD operations
// ===================================================================

import { User } from '../user/user.model';
import { Instructor } from './instructor.model';
import { TCreateInstructorInput, TUpdateInstructorInput } from './instructor.validation';
import AppError from '../../utils/AppError';
import { IInstructorFilters } from './instructor.interface';

/**
 * Create Instructor
 * Admin creates a User (role: instructor) + Instructor profile together
 */
const createInstructor = async (payload: TCreateInstructorInput) => {
    // Check if email already exists
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
        throw new AppError(409, 'A user with this email already exists');
    }

    // Step 1: Create User with role 'instructor'
    const userData = {
        email: payload.email,
        password: payload.password,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone || '',
        avatar: payload.avatar || '',
        role: 'instructor' as const,
        status: 'active' as const,
        isEmailVerified: true,
    };

    const user = await User.create(userData);

    // Step 2: Create Instructor profile linked to this user
    const instructorData = {
        userId: user._id,
        title: payload.title,
        titleBn: payload.titleBn || '',
        bio: payload.bio,
        bioBn: payload.bioBn || '',
        longBio: payload.longBio || '',
        longBioBn: payload.longBioBn || '',
        avatar: payload.avatar || '',
        coverImage: payload.coverImage || '',
        expertise: payload.expertise || [],
        experience: payload.experience || 0,
        specializations: payload.specializations || 0,
        education: payload.education || [],
        workExperience: payload.workExperience || [],
        certifications: payload.certifications || [],
        whatsAppNumber: payload.whatsAppNumber || '',
        socialLinks: payload.socialLinks || {},
        totalStudents: (payload as any).totalStudents || 0,
        isPublished: payload.isPublished !== undefined ? payload.isPublished : true,
        order: payload.order || 0,
    };

    const instructor = await Instructor.create(instructorData);

    // Populate user data
    const populatedInstructor = await Instructor.findById(instructor._id)
        .populate('userId', 'firstName lastName email phone avatar role status')
        .populate('assignedCourses', 'title thumbnail');

    return populatedInstructor;
};

/**
 * Get All Instructors (Admin)
 * সব instructors list (with pagination, search, filter)
 */
const getAllInstructors = async (
    filters: IInstructorFilters,
    paginationOptions: { page: number; limit: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }
) => {
    const { searchTerm, status, isPublished, expertise } = filters;
    const { page, limit, sortBy = 'order', sortOrder = 'asc' } = paginationOptions;

    const conditions: any[] = [{ isDeleted: { $ne: true } }];

    // Search
    if (searchTerm) {
        conditions.push({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { bio: { $regex: searchTerm, $options: 'i' } },
                { expertise: { $regex: searchTerm, $options: 'i' } },
            ],
        });
    }

    // Filters
    if (status) conditions.push({ status });
    if (isPublished !== undefined) conditions.push({ isPublished });
    if (expertise) conditions.push({ expertise: { $in: [expertise] } });

    const whereConditions = conditions.length > 0 ? { $and: conditions } : {};

    const skip = (page - 1) * limit;
    const sortConditions: any = {};
    sortConditions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [result, total] = await Promise.all([
        Instructor.find(whereConditions)
            .populate('userId', 'firstName lastName email phone avatar role status')
            .populate('assignedCourses', 'title thumbnail')
            .sort(sortConditions)
            .skip(skip)
            .limit(limit)
            .lean(),
        Instructor.countDocuments(whereConditions),
    ]);

    return {
        data: result,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Get Published Instructors (Public)
 * Homepage বা public page এর জন্য published instructors
 */
const getPublishedInstructors = async () => {
    const instructors = await Instructor.find({
        status: 'active',
        isPublished: true,
        isDeleted: { $ne: true },
    })
        .populate('userId', 'firstName lastName email avatar')
        .populate('assignedCourses', 'title thumbnail')
        .sort({ order: 1 })
        .lean();

    return instructors;
};

/**
 * Get Single Instructor
 */
const getInstructorById = async (id: string) => {
    const instructor = await Instructor.findById(id)
        .populate('userId', 'firstName lastName email phone avatar role status')
        .populate('assignedCourses', 'title thumbnail price discountPrice');

    if (!instructor) {
        throw new AppError(404, 'Instructor not found');
    }

    return instructor;
};

/**
 * Update Instructor (Admin only)
 */
const updateInstructor = async (id: string, payload: TUpdateInstructorInput) => {
    const instructor = await Instructor.findById(id);
    if (!instructor) {
        throw new AppError(404, 'Instructor not found');
    }

    // Update User fields if provided
    const userUpdateData: any = {};
    if (payload.firstName) userUpdateData.firstName = payload.firstName;
    if (payload.lastName) userUpdateData.lastName = payload.lastName;
    if (payload.phone) userUpdateData.phone = payload.phone;
    if (payload.avatar) userUpdateData.avatar = payload.avatar;
    if (payload.password) userUpdateData.password = payload.password;

    if (Object.keys(userUpdateData).length > 0) {
        // If password is being changed, we need to use save() to trigger pre-save middleware
        if (userUpdateData.password) {
            const user = await User.findById(instructor.userId).select('+password');
            if (user) {
                Object.assign(user, userUpdateData);
                await user.save();
            }
        } else {
            await User.findByIdAndUpdate(instructor.userId, userUpdateData);
        }
    }

    // Update Instructor profile fields
    const instructorUpdateData: any = {};
    const instructorFields = [
        'title', 'titleBn', 'bio', 'bioBn', 'longBio', 'longBioBn',
        'avatar', 'coverImage', 'expertise', 'experience', 'specializations',
        'education', 'workExperience', 'certifications', 'whatsAppNumber',
        'socialLinks', 'status', 'isPublished', 'order'
    ];

    instructorFields.forEach(field => {
        if ((payload as any)[field] !== undefined) {
            instructorUpdateData[field] = (payload as any)[field];
        }
    });

    const updatedInstructor = await Instructor.findByIdAndUpdate(
        id,
        instructorUpdateData,
        { new: true, runValidators: true }
    )
        .populate('userId', 'firstName lastName email phone avatar role status')
        .populate('assignedCourses', 'title thumbnail');

    return updatedInstructor;
};

/**
 * Delete Instructor (Soft delete - Admin only)
 */
const deleteInstructor = async (id: string) => {
    const instructor = await Instructor.findById(id);
    if (!instructor) {
        throw new AppError(404, 'Instructor not found');
    }

    // Soft delete instructor profile
    await Instructor.findByIdAndUpdate(id, { isDeleted: true });

    // Also soft delete the user account
    await User.findByIdAndUpdate(instructor.userId, { isDeleted: true });

    return { message: 'Instructor deleted successfully' };
};

export const InstructorService = {
    createInstructor,
    getAllInstructors,
    getPublishedInstructors,
    getInstructorById,
    updateInstructor,
    deleteInstructor,
};
