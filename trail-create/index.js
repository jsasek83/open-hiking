module.exports = function (context, req) {

    console.log("Received a request to create a new Trail");

    console.log(req);

    console.log(req.body);

    context.bindings.document = req.body;

    context.done();
};