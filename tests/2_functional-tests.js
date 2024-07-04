const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

const validPuzzle =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
const solution =
  "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
const unsolvablePuzzle =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.35.";
const invalidCharPuzzle =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3b.";
const invalidLengthPuzzle = "1.5..2.84..63.12.7.2..5.....9..1.";

suite("Functional Tests", () => {
  suite("POST /api/solve", () => {
    test("(1)A valid puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: validPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {solution} );
          done();
        });
    });
    test("(2)Missing input string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Required field missing" });
          done();
        });
    });
    test("(3)A puzzle string with invalid char", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: invalidCharPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
          done();
        });
    });
    test("(4)A puzzle string with invalid length", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: invalidLengthPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            error: "Expected puzzle to be 81 characters long",
          });
          done();
        });
    });
    test("(5)A unsolvable puzzle", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: unsolvablePuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Puzzle cannot be solved" });
          done();
        });
    });
  });

  suite("POST /api/check", () => {
    test("(6)With all valid fields", (done) => {
      const input = { puzzle: validPuzzle, coordinate: "A2", value: 3 };
      chai
        .request(server)
        .post("/api/check")
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { valid: true });
          done();
        });
    });
    test("(7)With one conflict", (done) => {
      const input = { puzzle: validPuzzle, coordinate: "A2", value: "7" };
      const expected = { valid: false, conflict: ["column"] };
      chai
        .request(server)
        .post("/api/check")
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected);
          done();
        });
    });
    test("(8)With two conflict", (done) => {
      const input = { puzzle: validPuzzle, coordinate: "A5", value: "4" };
      const expected = { valid: false, conflict: ["row", "column"] };
      chai
        .request(server)
        .post("/api/check")
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected);
          done();
        });
    });
    test("(9)With three conflict", (done) => {
      const input = { puzzle: validPuzzle, coordinate: "F4", value: "3" };
      const expected = { valid: false, conflict: ["row", "column", "region"] };
      chai
        .request(server)
        .post("/api/check")
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected);
          done();
        });
    });
    test("(10)With missing fields", (done) => {
      const input = { coordinate: "A2", value: "7" };
      const expected = { error: "Required field(s) missing" };
      chai
        .request(server)
        .post("/api/check")
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected);
          done();
        });
    });
    test("(11)With an invalid character in puzzle", (done) => {
      const input = { puzzle: invalidCharPuzzle, coordinate: "A2", value: "7" };
      const expected = { error: "Invalid characters in puzzle" };
      chai
        .request(server)
        .post("/api/check")
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected);
          done();
        });
    });
    test("(12)With incorrect length puzzle ", (done) => {
      const input = {
        puzzle: invalidLengthPuzzle,
        coordinate: "A2",
        value: "7",
      };
      const expected = { error: "Expected puzzle to be 81 characters long" };
      chai
        .request(server)
        .post("/api/check")
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected);
          done();
        });
    });
    test("(13)With an invalid coordinate", (done) => {
      const input = { puzzle: validPuzzle, coordinate: "R0", value: "9" };
      const expected = { error: "Invalid coordinate" };
      chai
        .request(server)
        .post("/api/check")
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected);
          done();
        });
    });
    test("(14)With invalid placement of a value", (done) => {
      const input = { puzzle: validPuzzle, coordinate: "A1", value: "0" };
      const expected = { error: "Invalid value" };
      chai
        .request(server)
        .post("/api/check")
        .send(input)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected);
          done();
        });
    });
  });
});
