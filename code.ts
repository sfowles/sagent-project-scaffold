figma.showUI(__html__);

const documentName = figma.root.name;
figma.ui.postMessage(documentName);

figma.ui.resize(500, 500);

figma.ui.onmessage = async(pluginMessage) => {

  // Need to load a font here to generate components and page examples.
  await figma.loadFontAsync({ family: "PP Mori", style: "Regular" });
  await figma.loadFontAsync({ family: "PP Mori", style: "SemiBold" });
  await figma.loadFontAsync({ family: "Helvetica Now Display", style: "Regular" });
  await figma.loadFontAsync({ family: "Helvetica Now Display", style: "Bold" });

  // Set page names and renames the default "Page 1"
  let breakPage = figma.createPage();
  let workingPage = figma.createPage();
  // Check if this file is for a component
  if (pluginMessage.isComponent) {
    let reqPage = figma.createPage();
    let docPage = figma.createPage();
    reqPage.name = "📖 Requirements";
    docPage.name = "📖 Documentation";
    // Instantiate component documentation from published component.
    let documentationComponentSet = await figma.importComponentSetByKeyAsync("453910918ddaac17c505d209f6b3b0f68c352e31");
    const selectedDocumentationVariant = documentationComponentSet.findOne(
      node => node.type == "COMPONENT" &&
      node.name == `Variant=Default`
    ) as ComponentNode;
    const selectedDocumentationVariantInstance = selectedDocumentationVariant.createInstance();
    const documentationHeading = selectedDocumentationVariantInstance.findOne(
      node => node.type == 'TEXT' &&
      node.name == 'Heading'
    ) as TextNode;
    documentationHeading.characters = pluginMessage.title;
    const documentationDescription = selectedDocumentationVariantInstance.findOne(
      node => node.type == 'TEXT' &&
      node.name == 'Description'
    ) as TextNode;
    documentationDescription.characters = pluginMessage.description;
    docPage.appendChild(selectedDocumentationVariantInstance);
    const nodes: SceneNode[] = [];
    nodes.push(selectedDocumentationVariantInstance);
    figma.viewport.scrollAndZoomIntoView(nodes);

    // Instantiate component requirements from published component.
    let requirementsComponentSet = await figma.importComponentSetByKeyAsync("e6d97f0899b0aef118a5b633e942e212d6123ab4");
    const selectedRequirementsVariant = requirementsComponentSet.findOne(
      node => node.type == "COMPONENT" &&
      node.name == `Variant=Default`
    ) as ComponentNode;
    const selectedRequirementsVariantInstance = selectedRequirementsVariant.createInstance();
    reqPage.appendChild(selectedRequirementsVariantInstance);
    const nodes2: SceneNode[] = [];
    nodes2.push(selectedRequirementsVariantInstance);
    figma.viewport.scrollAndZoomIntoView(nodes2);
  }
  let breakPage2 = figma.createPage();
  let referencePage = figma.createPage();
  let coverPage = figma.createPage();

  figma.currentPage.name = "📓 Overview";
  breakPage.name = "-----";

  switch (pluginMessage.status) {
    case "Exploration":
      workingPage.name = "🚀 Exploration";
      break;
    case "Design In Progress":
      workingPage.name = "🚧 Design In Progress";
      break;
    case "Ready For Development":
      workingPage.name = "✅ Ready For Development";
      break;
    case "Ongoing":
      workingPage.name = "🔮 Ongoing";
      break;
    case "Shipped":
      workingPage.name = "🚢 Shipped";
      break;
    case "Paused":
      workingPage.name = "⏸ Paused";
      break;
    case "Internal":
      workingPage.name = "🔒 Internal";
      break;
    case "Pending Approval":
      workingPage.name = "✋ Pending Approval";
      break;
    case "Scrapped":
      workingPage.name = "💀 Scrapped";
      break;
  }

  if (pluginMessage.isComponent) {
    workingPage.name = "⚙️ " + pluginMessage.title + " Component";
  }

  breakPage2.name = "-----";
  referencePage.name = "📖 Pages Reference";
  coverPage.name = "📄 Cover";

  // Frame for wrapping the list of page examples.
  let listFrame = figma.createFrame();
  listFrame.name = "Other page examples";
  listFrame.layoutMode = "VERTICAL";
  listFrame.counterAxisSizingMode = "AUTO";
  listFrame.verticalPadding = 16;
  listFrame.horizontalPadding = 16;
  listFrame.itemSpacing = 16;
  listFrame.cornerRadius = 8;
  referencePage.appendChild(listFrame);

  // Instantiate project overview from published component.
  let overviewComponentSet = await figma.importComponentSetByKeyAsync("4750fb4dde60484f5318b14afce6abad240dd05c");
  const selectedOverviewVariant = overviewComponentSet.findOne(
    node => node.type == "COMPONENT" &&
    node.name == `Variant=Default`
  ) as ComponentNode;
  const selectedOverviewVariantInstance = selectedOverviewVariant.createInstance();
  const overviewDescription = selectedOverviewVariantInstance.findOne(
    node => node.type == 'TEXT' &&
    node.name == 'Body Text'
  ) as TextNode;
  overviewDescription.characters = pluginMessage.description;
  const overviewAzure = selectedOverviewVariantInstance.findOne(
    node => node.type == 'TEXT' &&
    node.name == '*Paste Azure ticket here'
  ) as TextNode;
  overviewAzure.characters = pluginMessage.azure;
  const overviewOwner = selectedOverviewVariantInstance.findOne(
    node => node.type == 'TEXT' &&
    node.name == 'First & Last Name'
  ) as TextNode;
  overviewOwner.characters = pluginMessage.owner;
  const overviewStart = selectedOverviewVariantInstance.findOne(
    node => node.type == 'TEXT' &&
    node.name == 'Month DD, YYYY'
  ) as TextNode;
  overviewStart.characters = pluginMessage.start;
  figma.currentPage.appendChild(selectedOverviewVariantInstance);
  const nodes: SceneNode[] = [];
  nodes.push(selectedOverviewVariantInstance);
  figma.viewport.scrollAndZoomIntoView(nodes);

  // Instantiate cover image from published component.
  let coverComponentSet = await figma.importComponentSetByKeyAsync("a23e16055f7d6f613f9f31c271b684b741308179");
  const selectedVariant = coverComponentSet.findOne(
    node => node.type == "COMPONENT" &&
    node.name == `Status=${pluginMessage.status}`
  ) as ComponentNode;
  const selectedVariantInstance = selectedVariant.createInstance();
  const variantTitle = selectedVariantInstance.findOne(
    node => node.type == 'TEXT' &&
    node.name == 'Title'
  ) as TextNode;
  const variantWorkstream = selectedVariantInstance.findOne(
    node => node.type == 'TEXT' &&
    node.name == 'Workstream'
  ) as TextNode;
  variantTitle.characters = pluginMessage.title;
  variantWorkstream.characters = pluginMessage.workstream;

  // Create frame for wrapping the cover image.
  let coverFrame = figma.createFrame();
  coverFrame.name = "Cover";
  coverPage.appendChild(coverFrame);
  coverFrame.appendChild(selectedVariantInstance);
  coverFrame.resize(selectedVariantInstance.width, selectedVariantInstance.height);

  // Define the document thumbnail.
  figma.setFileThumbnailNodeAsync(coverFrame);

  let run = async () => {

    // To make adding additional pages easy, we include some text on a
    // reference page so we can copy/paste them with the proper emoji.
    await createAdditionalPageExample("📓 Overview");
    await createAdditionalPageExample("🚀 Exploration");
    await createAdditionalPageExample("🚧 Design In Progress");
    await createAdditionalPageExample("🔮 Ongoing");
    await createAdditionalPageExample("✅ Ready For Development");
    await createAdditionalPageExample("🚢 Shipped");
    await createAdditionalPageExample("⏸ Paused");
    await createAdditionalPageExample("🕹 Prototype");
    await createAdditionalPageExample("⚙️ Components");
    await createAdditionalPageExample("🔒 Internal");
    await createAdditionalPageExample("✋ Pending Approval");
    await createAdditionalPageExample("💀 Scrapped");
    await createAdditionalPageExample("🔖 Archived");
    await createAdditionalPageExample("📖 Reference");

    // Success notice and close plugin
    figma.notify("Project Scaffolding for " + documentName + " done! 👍");
    figma.closePlugin();
  }

  // This function adds an example of how to name your less common pages
  // and their emoji to the reference page.
  let createAdditionalPageExample = (text: string) => {
    let linkLabel = figma.createText();
    linkLabel.fontName = { family: "Helvetica Now Display", style: "Regular" };
    linkLabel.characters = text;
    linkLabel.fontSize = 16;
    listFrame.appendChild(linkLabel);
  };

  run();

}
