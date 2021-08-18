import themes from "@/resources/theme";

export const updateThemeVariables = (themeName: string) => {
  const arrayOfVariableKeys = Object.keys(themes[themeName]);
  const arrayOfVariableValues: string[] = Object.values(themes[themeName]);
  //Loop through each array key and set the CSS Variables
  arrayOfVariableKeys.forEach((cssVariableKey, index) => {
    //Based on our snippet from MDN
    document.documentElement.style.setProperty(
      cssVariableKey,
      arrayOfVariableValues[index]
    );
  });

  //switching chart component theme
  const elms = document.getElementsByTagName("body");
  const body = elms && elms.length ? elms[0] : null;
  if (body) {
    body.className = themeName;
  }
};
