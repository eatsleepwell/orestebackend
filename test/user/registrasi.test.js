import supertest from "supertest";
import {prismaClient} from "../../src/application/database.js"
import {logger} from "../../src/application/logging.js";
import {app} from "../../src/application/app.js"

describe('POST /api/users', () => {

    afterEach(async () => {
        await prismaClient.user.deleteMany({
            where: {
                username: 'rizky'
            }
        })
    })

    it('should can register new user', async () => {
        const result = await supertest(app)
        .post('/api/users')
        .send({
            username: "rizky",
            password: "rahasia",
            confirmPassword: "rahasia",
            name : 'rizky darmawan'
        })

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("rizky");
        expect(result.body.data.name).toBe("rizky darmawan");
        expect(result.body.data.password).toBeUndefined();
    })

    it('should reject if reject is invalid', async () => {
        const result = await supertest(app)
        .post('/api/users')
        .send({
            username: "",
            password: "",
            confirmPassword: "",
            name : ''
        })

        logger.info(result.body);
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined()
    })

    it('should reject if password and confirm password different', async () => {
        const result = await supertest(app)
        .post('/api/users')
        .send({
            username: "rizky",
            password: "heheheh",
            confirmPassword: "rahasia",
            name : 'Rizky Darmawan'
        })

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined()
    })

    it('should reject if username already registered', async () => {
        let result = await supertest(app)
        .post('/api/users')
        .send({
            username: "rizky",
            password: "rahasia",
            confirmPassword: "rahasia",
            name : 'rizky darmawan'
        })

        logger.info(result.body)

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("rizky");
        expect(result.body.data.name).toBe("rizky darmawan");
        expect(result.body.data.password).toBeUndefined();

        result = await supertest(app)
        .post('/api/users')
        .send({
            username: "rizky",
            password: "rahasia",
            confirmPassword: "rahasia",
            name : 'rizky darmawan'
        })

        logger.info(result.body)

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    })
})