
class TestController {
  constructor() {
  }

  // 测试用的
  async getHelloWorld(req, res) {
    res.json({
      msg: "hello from the other side",
      code: 200,
      data: null,
      ok: true,
    });
  }
}

module.exports = new TestController();
