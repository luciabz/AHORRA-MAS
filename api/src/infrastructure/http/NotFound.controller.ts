import ControllerBuilder from "../../share/utils/controllerBuilder";


const NotFoundController = ControllerBuilder((_, res) => {
    res.statusCode = 404;
    return "Not Found";
});

export default NotFoundController;
