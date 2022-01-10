const reviewModel = require("./ReviewModel")

exports.handleMessage = async (info) => {
    //console.log(info);
    let result = true;
    const reviewInfo = {
        classId: info.classRoomId,
        studentId: info.userId,
        title: info.title,
        commentList: [
            {
                comment: info.Message,
                date: info.Date,
                commentUser: info.userId
            }
        ]
    }

    //Kiểm tra đã tồn tại 
    const isExist = await reviewModel.findOne({
        classId: info.classRoomId,
        studentId: info.userId,
        title: info.title
    })

    if (isExist) {
        //console.log(isExist)
        // let newcommentList = isExist.commentList;
        // newcommentList.push(reviewInfo.commentList[0])
        // await reviewModel.findOneAndUpdate(
        //     {
        //         classId: info.classRoomId,
        //         studentId: info.userId,
        //         title: info.title
        //     },
        //     {
        //         classId: info.classRoomId,
        //         studentId: info.userId,
        //         title: info.title,
        //         commentList: [
        //             {
        //                 comment: info.Message,
        //                 date: info.Date,
        //                 commentUser: info.userId
        //             }
        //         ]
        //     }
        // )
        result = false;
    }
    else{
        const newReview = new reviewModel(reviewInfo)

        await newReview.save()
    }

    return result;
}