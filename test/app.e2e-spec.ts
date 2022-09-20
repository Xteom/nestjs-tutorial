import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as pactum from 'pactum';
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from "../src/app.module";
import { AuthDto } from "src/auth/dto";
import { EditUserDto } from "src/user/dto";
import { CreateBookmarkDto, EditBookmarkDto } from "src/bookmark/dto";
/**
 * poner => {}
 * es para llamar a la call back function
 */
describe('App e2e', () => {
  let app: INestApplication;
  let primsa: PrismaService;
  //starting logic 
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],// importamos todo porque lo que queremos es end 2 end
    }).compile(); 
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true
      })
    );
    await app.init();
    await app.listen(3333);

    primsa = app.get(PrismaService);

    await primsa.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333'); //con esto ya no tenemos que establecer la ruta cada vez 
  });

  //tear down logic
  afterAll(() => {
    app.close(); 
  })
  

  //Tests para cada modulo para integration testing
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'mat@correo.com',
      password: '123'
    };
    describe('Signup', () => {
      it('should throw exception if email empty', () => {
        return pactum
        .spec()
        .post('/auth/signup')
        .withBody({password: dto.password})
        .expectStatus(400);
      });

      it('should throw exception if password empty', () => {
        return pactum
        .spec()
        .post('/auth/signup')
        .withBody({email: dto.email})
        .expectStatus(400);
      });

      it('should throw exception if no body provided', () => {
        return pactum
        .spec()
        .post('/auth/signup')
        .expectStatus(400);
      });

      it('should signup', () => {
        return pactum
        .spec()
        .post('/auth/signup')
        .withBody(dto)
        .expectStatus(201)
        //.inspect();//inspect es para ver que hay dentro del request body  
      });
    });

    describe('Signin', () => {
      it('should throw exception if email empty', () => {
        return pactum
        .spec()
        .post('/auth/signin')
        .withBody({password: dto.password})
        .expectStatus(400);
      });

      it('should throw exception if password empty', () => {
        return pactum
        .spec()
        .post('/auth/signin')
        .withBody({email: dto.email})
        .expectStatus(400);
      });

      it('should throw exception if no body provided', () => {
        return pactum
        .spec()
        .post('/auth/signin')
        .expectStatus(400);
      }); 

      it('should signin', () =>{
        return pactum
        .spec()
        .post('/auth/signin')
        .withBody(dto)
        .expectStatus(200)
        .stores('userAt', 'access_token'); //guarda el access token en userAt para usarlo despues
      });
    });

  });

  
  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
        .spec()
        .get('/users/me')
        .withHeaders({Authorization: 'Bearer $S{userAt}' })
        .expectStatus(200)
        //.inspect()
        ;
      })
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'Mateo',
          lastName: 'last',
          email: 'mat@correo.com'
        }
        return pactum
        .spec()
        .patch('/users')
        .withHeaders({Authorization: 'Bearer $S{userAt}' })
        .withBody(dto)
        .expectStatus(200)
        //.inspect()
        .expectBodyContains(dto.firstName)
        .expectBodyContains(dto.email);
      })
    });

  });

  
  describe('Bookmarks', () => {
    describe('Get empty bookmarks', () => {
      it('should get Bookmarks', () => {
        return pactum
        .spec()
        .get('/bookmarks')
        .withHeaders({Authorization: 'Bearer $S{userAt}' })
        .expectStatus(200)
        .expectBody([]);
      })
    });
    
    /*
    describe('Create bookmark', () => {
      it('should create Bookmark', () => {
        const dto: CreateBookmarkDto = {
          title: "Soy un bookmark", 
          link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        };
        return pactum
        .spec()
        .post('/bookmarks')
        .withHeaders({Authorization: 'Bearer $S{userAt}' })
        .withBody(dto)
        .expectStatus(201).inspect();
      })
    });
    */

    describe('Get bookmark', () => {});

    describe('Get bookmark by id', () => {});

    describe('Edit bookmark by id', () => {});

    describe('Delete bookmark by id', () => {});



  });
  //it.todo('should pass');
});


/**
 * así estaba antes 
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
*/
