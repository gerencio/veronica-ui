/**
 * Created by clayton on 21/08/15.
 */
module.exports = function() {
    var homeController = {};
    homeController.index = function(req, res) {
        res.render('index', {});
    };
    return homeController;
};
