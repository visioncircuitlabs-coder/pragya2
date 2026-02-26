"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var API_URL = 'http://localhost:4000/api/v1';
function completeAssessment() {
    return __awaiter(this, void 0, void 0, function () {
        var loginRes, token, headers, availRes, assessmentId, startRes, userAssessmentId, questionsRes, questions, answers, i, q, randomOptionIndex, selectedOption, submitRes, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🤖 Automating Pragya 360° Employability Assessment...\n');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    // 1. Log in as Job Seeker
                    console.log('🔑 Logging in...');
                    return [4 /*yield*/, axios_1.default.post("".concat(API_URL, "/auth/login"), {
                            email: 'lorin@gmail.com',
                            password: 'Pragya@123',
                        })];
                case 2:
                    loginRes = _a.sent();
                    token = loginRes.data.access_token;
                    headers = { Authorization: "Bearer ".concat(token) };
                    console.log('✅ Logged in successfully.\n');
                    // 2. Fetch available assessments and start
                    console.log('📋 Fetching available assessments...');
                    return [4 /*yield*/, axios_1.default.get("".concat(API_URL, "/assessments"), { headers: headers })];
                case 3:
                    availRes = _a.sent();
                    assessmentId = availRes.data[0].id;
                    console.log("\uD83D\uDE80 Starting assessment ID: ".concat(assessmentId));
                    return [4 /*yield*/, axios_1.default.post("".concat(API_URL, "/assessments/start"), { assessmentId: assessmentId }, { headers: headers })];
                case 4:
                    startRes = _a.sent();
                    userAssessmentId = startRes.data.userAssessmentId || startRes.data.id;
                    console.log("\uD83D\uDCDD User Assessment ID: ".concat(userAssessmentId, "\n"));
                    // 3. Fetch questions
                    console.log('📚 Fetching questions...');
                    return [4 /*yield*/, axios_1.default.get("".concat(API_URL, "/assessments/").concat(assessmentId, "/questions"), { headers: headers })];
                case 5:
                    questionsRes = _a.sent();
                    questions = questionsRes.data.questions;
                    console.log("\u2705 Fetched ".concat(questions.length, " questions.\n"));
                    // 4. Generate pseudo-random realistic answers for all questions
                    console.log('✏️ Answering all questions...');
                    answers = [];
                    for (i = 0; i < questions.length; i++) {
                        q = questions[i];
                        randomOptionIndex = Math.floor(Math.random() * q.options.length);
                        selectedOption = q.options[randomOptionIndex];
                        answers.push({
                            questionId: q.id,
                            selectedOptionId: selectedOption.id
                        });
                        if ((i + 1) % 50 === 0) {
                            console.log("   Checked ".concat(i + 1, " questions..."));
                        }
                    }
                    console.log('\n✅ All questions answered in memory.\n');
                    // 5. Submit assessment
                    console.log('📤 Submitting assessment...');
                    return [4 /*yield*/, axios_1.default.post("".concat(API_URL, "/assessments/submit"), {
                            userAssessmentId: userAssessmentId,
                            answers: answers,
                        }, { headers: headers })];
                case 6:
                    submitRes = _a.sent();
                    console.log('🎉 Assessment submitted successfully!');
                    console.log('Response:', submitRes.data);
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    console.error('❌ Error in automation script:');
                    if (error_1.response) {
                        console.error(error_1.response.data);
                    }
                    else {
                        console.error(error_1.message);
                    }
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
completeAssessment();
