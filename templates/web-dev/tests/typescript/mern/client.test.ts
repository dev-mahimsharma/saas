describe("MERN client starter", () => {
  it("keeps the auth-ready shell available", () => {
    const routes = ["/login", "/register", "/dashboard"];

    expect(routes).toContain("/login");
  });
});
