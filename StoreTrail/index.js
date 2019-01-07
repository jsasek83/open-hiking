module.exports = function (context, req) {

    console.log("Received a request to create a new Trail");

    console.log(req);

    context.bindings.document = {
        type : req.body.type,
        user : req.body.user,
        xml : req.body.trailXml
    };  

    context.done();
};