import { DataNode } from "antd/es/tree";
import _ from "lodash";

export const compareNumbers = (a: any, b: any, key?: string) => {
  if (!key) return +a - +b;
  return (+a[key] || 0) - (+b[key] || 0);
};

export const compareStrings = (a: any, b: any, key: string) => {
  const nameA = (key ? a[key] : a)?.toUpperCase() || ""; // ignore upper and lowercase
  const nameB = (key ? b[key] : b)?.toUpperCase() || ""; // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
};

export const compareDates = (a: any, b: any, key: string) => {
  const nameA = new Date(key ? a[key] : a).getTime();
  const nameB = new Date(key ? b[key] : b).getTime();

  if (nameA < nameB) return -1;
  if (nameA > nameB) return 1;

  return 0;
};

// find each element on original array and updatedArray.
// if element is not found on updatedArray, add status: 'remove'.
// if element is not found on original array, add status: 'create'.
// original [{a: 1, b: 2}, {a: 3, b: 4}] + newArray [{a: 1, b: 3}, {a: 5, b: 6}]

// result   [{a: 3, b: 4, status: 'remove'}, {a: 5, b: 6, status:'create'}]
export const getUpdatedArray = (
  originalArray: any[],
  updatedArray: any[],
  unionKey: string,
) => {
  // get difference between originalArray and updatedArray
  const difference = _.differenceBy(originalArray, updatedArray, unionKey);
  // get intersection between originalArray and updatedArray
  const intersection = _.intersectionBy(originalArray, updatedArray, unionKey);
  // get difference between updatedArray and originalArray
  const difference2 = _.differenceBy(updatedArray, originalArray, unionKey);

  // add status: 'remove' for each element in difference
  const result = difference.map((element) => {
    return { ...element, status: "3" };
  });

  // add status: 'create' for each element in difference2
  difference2.forEach((element) => {
    result.push({ ...element, status: "1" });
  });

  // find each element in intersection and updatedArray
  // if element is not updated, add status: 'update'
  intersection.forEach((element) => {
    const index = _.findIndex(updatedArray, [unionKey, element[unionKey]]);
    if (!_.isEqual(element, updatedArray[index])) {
      result.push({ ...updatedArray[index], status: "2" });
    }
  });

  // return result
  return result;
};

export const filterNot = (
  origin: any[] = [],
  filter: any[] = [],
  keyFilter: string | number,
) => {
  let result = [];
  result = origin.filter((element) => !filter.includes(element[keyFilter]));
  return result;
};

export const getNodeFromTree = (tree: DataNode[], function_id: string): any => {
  const stack: DataNode[] = [...tree];

  while (stack.length > 0) {
    const node = stack.pop();

    if (node?.key === function_id) {
      return node;
    }

    if (node?.children) {
      stack.push(...node.children);
    }
  }

  return null;
};

export const flattenTree = (tree: any = []) => {
  const stack = [...tree];
  const result = [];

  while (stack.length > 0) {
    const node = stack.pop();
    // Add the current node's value to the result
    const { children, ...values } = node;
    result.push({ ...values });

    // Add children to the stack in reverse order
    if (node.children)
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push(node.children[i]);
      }
  }

  return result;
};

export const checkIfNotEnoughLeafs = (
  tree: any[] = [],
  functions: string[] = [],
) => {
  const cloneFunctions = _.clone(functions);

  if (!tree || tree.length === 0) {
    return false; // Return 1 to indicate one leaf node.
  }

  const parentToRemove: string[] = [];

  for (let i = 0; i < tree.length; i++) {
    const children = tree[i].children;
    if (children) {
      const c = children.find(
        (child: any) => !cloneFunctions.includes(child.value),
      );
      checkIfNotEnoughLeafs(children, cloneFunctions);

      if (c) {
        parentToRemove.push(tree[i].value);
      }
    }
  }

  return parentToRemove;
};
