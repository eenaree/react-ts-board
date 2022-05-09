import * as path from 'path';
import * as morgan from 'morgan';
import * as express from 'express';
import * as session from 'express-session';
import * as cors from 'cors';
import { sequelize } from '@models';
import routes from '@routes';

const isDevelopment = process.env.NODE_ENV !== 'production';

const app = express();

const sessionOptions = {
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET as string,
  cookie: {
    httpOnly: true,
    secure: false,
  },
};

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.set('port', process.env.PORT || 8080);

(async function () {
  try {
    await sequelize.sync();
    console.log('db 연결 성공!');
  } catch (error) {
    console.error(error);
    console.log('db 연결 실패...');
  }
})();

if (isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionOptions));

app.use('/api', routes);

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log(err.stack);
    res.status(500).send('서버 오류 발생!!!');
  }
);

app.listen(app.get('port'), () => {
  console.log(`${app.get('port')}번 포트에서 서버 대기 중...`);
});
