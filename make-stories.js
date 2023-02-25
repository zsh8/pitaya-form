const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const argv = process.argv.slice(2);

if (argv.length < 1) {
  console.error("Usage: node make-stories.js [directory-name]...");
  process.exit(1);
}

for (const inputPath of argv) {
  const dirName = path.basename(inputPath);
  const outputPath = path.join(
    path.dirname(inputPath),
    `${dirName}.stories.tsx`
  );

  fs.readdir(inputPath, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${inputPath}: ${err}`);
      process.exit(1);
    }

    const yamlFiles = files.filter((file) =>
      [".yaml", ".json"].includes(path.extname(file).toLowerCase())
    );

    if (yamlFiles.length === 0) {
      console.warn(`No YAML files found in directory ${inputPath}`);
      return;
    }

    const outputData = yamlFiles.reduce((acc, file) => {
      const filePath = path.join(inputPath, file);
      const fileData = fs.readFileSync(filePath, "utf8");
      const jsonData = yaml.load(fileData);
      return { ...acc, [file]: jsonData };
    }, {});

    let stories = "";
    for (const [fileName, content] of Object.entries(outputData)) {
      const storyName = path.parse(fileName).name;
      stories = `${stories}
export const ${storyName} = Template.bind({});
${storyName}.args = ${JSON.stringify(content, null, 4)}
`;
    }

    const storiesScript = `import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { PitayaForm } from "..";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "PitayaForm/${dirName}",
  component: PitayaForm,
} as ComponentMeta<typeof PitayaForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PitayaForm> = (args) => <PitayaForm {...args} />;
${stories}`;

    fs.writeFile(outputPath, storiesScript, (err) => {
      if (err) {
        console.error(`Error writing output file ${outputPath}: ${err}`);
        process.exit(1);
      }
      console.log(`Stories script written to ${outputPath}`);
    });
  });
}
