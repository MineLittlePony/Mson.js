
/*export*/ function fixedLength(arr, len, fillWith) {
  arr = arr || [];
  if (fillWith === undefined) {
    fillWith = 0;
  }
  if (typeof arr === 'number') {
    return fixedLength([], len, arr);
  }
  while (arr.length < len) {
    arr.push(fillWith);
  }
  return arr;
}
