const getNodeName = (node) => {
  const nodeName =
    node?.name ||
    node?.key?.name ||
    node?.id?.name ||
    node?.left?.property?.name ||
    (node?.declarations && node?.declarations[0]?.id?.name) ||
    null;

  if (!nodeName) {
    // logBgBlue(`No node name found for node`);
  }

  // logBgBlue(`Node name: ${nodeName}`);

  return nodeName;
};

module.exports = getNodeName;
