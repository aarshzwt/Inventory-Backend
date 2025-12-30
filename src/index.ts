import sequelizeService from "./services/sequelize.service";
import expressService from "./services/express.service";

const services = [
    sequelizeService,
    expressService
];

(async () => {
    try {
        for (const service of services) {
            await service.init();
        }
        console.log("Server initialized.");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})();



// const app = express();
// const PORT = process.env.PORT || 5000;

// /**
//  * Middlewares
//  */
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// /**
//  * Health check
//  */
// app.get("/health", (_req, res) => {
//     res.status(200).json({ status: "OK" });
// });
