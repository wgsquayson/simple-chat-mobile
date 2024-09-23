export default function placeValues(baseString: string, ...values: string[]) {
  let newText = baseString;
  for (const value of values) {
    newText = newText.replace("###", value);
  }

  return newText;
}
