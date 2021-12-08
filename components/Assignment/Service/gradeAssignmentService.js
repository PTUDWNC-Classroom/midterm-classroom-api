const mongoose = require("mongoose")
const gradeAssignmentModel = require("../Model/gradeAssignment")

// Sắp xếp theo indexAssignment
function SortByIndexAssignment(data) {
    let result = data;
    let tmp = null;
    for (let i = 0; i < result.length - 1; i++) {
        for (let j = i + 1; j < result.length; j++) {
            if (result[i].indexAssignment > result[j].indexAssignment) {
                tmp = result[i];
                result[i] = result[j];
                result[j] = tmp;
            }
        }
    }
    //console.log(result);
    return result;
}


exports.getGradeStructAssignment = async (classId) => {
    // Tìm tất cả GradeAssignment theo classId
    const result = await gradeAssignmentModel.find({classId: mongoose.Types.ObjectId(classId)});

    console.log(result)

    const result_sort = SortByIndexAssignment(result);

    return result_sort;
}

exports.addAssignmentIntoStruct = async (assignment) => {
    //console.log(assignment);


    // Đếm số lượng assignment 
    const data = await gradeAssignmentModel.find();

    // Thêm indexAssignment để sắp xếp khi drag và drop
    const data_sort = SortByIndexAssignment(data)
    let index = data_sort.length;
    if (index !== 0) {
        //console.log(data[index-1])
        //console.log(typeof( data[index - 1].indexAssignment))
        index = data_sort[index - 1].indexAssignment + 1;
    }
    // Thêm vào database
    const assignmentInfo = {
        classId: assignment.classId,
        gradeTitle: assignment.gradeTitle,
        gradeDetail: assignment.gradeDetail,
        disableState: true,
        indexAssignment: index
    }
    const newGradeAssignment = new gradeAssignmentModel(assignmentInfo)

    await newGradeAssignment.save()

    return newGradeAssignment._id;
}

exports.updateAssignmentIntoStruct = async (assignment) => {
    console.log(assignment)
    const result = await gradeAssignmentModel.findOneAndUpdate(
        { _id: assignment._id },
        {
            gradeTitle: assignment.gradeTitle,
            gradeDetail: assignment.gradeDetail
        })

    return result;
}

exports.updateIndexAssignmentIntoStruct = async (assignment) => {
    console.log("updateIndexAssignmentIntoStruct")

    // Tìm tất cả assignment theo classId
    const assignment1 = await gradeAssignmentModel.find(
        {
            classId: mongoose.Types.ObjectId(assignment.classId)
        })

    // Sắp xếp assignment vừa tìm được
    const result_sort = SortByIndexAssignment(assignment1);


    //console.log((result_sort[1]._id).toString() === assignment.sourceId)
    // Thay desIndex vào indexAssignment của gradeAssignment có sourceId
    await gradeAssignmentModel.findOneAndUpdate(
        { _id: assignment.sourceId },
        {
            indexAssignment: assignment.desIndex
        })
    if (assignment.sourceIndex < assignment.desIndex) {
        for (let i = 0; i < result_sort.length; i++) {
            if ((result_sort[i]._id).toString() === assignment.sourceId) {
                //console.log("vao ")
                for (let j = i + 1; j < result_sort.length; j++) {

                    await gradeAssignmentModel.findOneAndUpdate(
                        { _id: result_sort[j]._id },
                        {
                            indexAssignment: result_sort[j - 1].indexAssignment
                        })
                    if ((result_sort[j]._id).toString() === assignment.desId) {
                        break;
                    }
                }
                break;
            }
        }
    }
    else if (assignment.sourceIndex > assignment.desIndex) {
        for (let i = 0; i < result_sort.length; i++) {
            if ((result_sort[i]._id).toString() === assignment.desId) {
                //console.log("vao ")
                for (let j = i; j < result_sort.length - 1; j++) {

                    await gradeAssignmentModel.findOneAndUpdate(
                        { _id: result_sort[j]._id },
                        {
                            indexAssignment: result_sort[j + 1].indexAssignment
                        })
                    if ((result_sort[j + 1]._id).toString() === assignment.sourceId) {
                        break;
                    }
                }
                break;
            }
        }
    }

    // const assignment1 = await gradeAssignmentModel.findOneAndUpdate(
    //     { _id: assignment.desId },
    //     {
    //         indexAssignment: assignment.sourceIndex
    //     })

    // const assignment2 = await gradeAssignmentModel.findOneAndUpdate(
    //     { _id: assignment.sourceId },
    //     {
    //         indexAssignment: assignment.desIndex
    //     })

    // let result = false;

    // if(assignment1!== null && assignment2 !== null)
    // {
    //     result =false;
    // }

    return true;
}

exports.deleteAssignmentStruct = async (assignment) => {
    console.log(assignment)
    const result = await gradeAssignmentModel.deleteOne({ _id: assignment._id })

    return result;
}