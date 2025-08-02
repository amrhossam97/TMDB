import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import * as bodyParser from "body-parser";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/exceptions/http-exception.filter";
import { createDocument } from "./common/swagger/swagger";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const PORT = process.env.PORT || 7000;
console.log("migration run status : ", process.env.RUN_MIGRATIONS);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.enableCors();
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    })
  );
  app.use(bodyParser.json({ limit: "20mb" }));
  app.use(
    bodyParser.urlencoded({
      limit: "20mb",
      extended: true,
      parameterLimit: 10000,
    })
  );
  (app as any).set("etag", false);
  app.use((req, res, next) => {
    res.removeHeader("x-powered-by");
    res.removeHeader("date");
    next();
  });
  app.setGlobalPrefix("/tmdb-service/api");
  app.useGlobalFilters(new HttpExceptionFilter());
  SwaggerModule.setup("/tmdb-service/docs/v1", app, createDocument(app));

  process.on("unhandledRejection", (reason, p) => {
    throw reason;
  });
  await app.listen(PORT, () => {
    console.log(`TMDB APP: Running at port ${PORT}`);
  });
}
bootstrap();
