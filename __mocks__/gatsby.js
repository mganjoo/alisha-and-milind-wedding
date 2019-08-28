const React = require("react")
const gatsby = jest.requireActual("gatsby")

module.exports = {
  ...gatsby,
  graphql: jest.fn(),
  Link: jest.fn().mockImplementation(({ to, className }) =>
    React.createElement("a", {
      href: to,
      className: className,
    })
  ),
  StaticQuery: jest.fn(),
  useStaticQuery: jest.fn(),
}
