export default (theme) => {
  console.log(theme);
  return {
    App: {
      textAlign: "center",
      [theme.breakpoints.up("md")]: {},
      [theme.breakpoints.down("md")]: {},
    },
  };
};
