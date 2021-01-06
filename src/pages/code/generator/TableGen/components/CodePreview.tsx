import {Tabs} from "antd";
import React, {useEffect, useState} from "react";
import {Prism} from "react-syntax-highlighter";
import {vscDarkPlus} from "react-syntax-highlighter/dist/esm/styles/prism";
import {PreviewCode} from "@/pages/code/generator/data";
import styles from "@/pages/code/generator/TableGen/index.less";

export interface CodePreviewProps {
  codePreviewList: PreviewCode[];
}

const CodePreview: React.FC<CodePreviewProps> = (props) => {
  const {codePreviewList} = props;
  const [codePreviewItem, setCodePreviewItem] = useState<any[]>([]);

  useEffect(() => {
    if(codePreviewList.length > 0){
      generatorCodePreviewItem();
    }
  }, [codePreviewList]);

  const generatorCodePreviewItem = (): void => {
    const tmpArr: any[] = [];
    codePreviewList.forEach((item, index) => {
      tmpArr.push(
        <Tabs.TabPane tab={item.fileName} key={String(index + 1)}>
          <Prism
            showLineNumbers
            startingLineNumber={1}
            language={item.fileType}
            wrapLines
            style={vscDarkPlus}
          >
            {item.content}
          </Prism>
        </Tabs.TabPane>
      );
    })
    setCodePreviewItem(tmpArr);
  };


  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        className={[`${styles.tabsDiv}`, `${styles.divYScroll}`, `${styles.divOverFlowYScroll}`].join(' ')}
      >
        {
          codePreviewItem
        }
      </Tabs>
    </div>
  );
};
export default CodePreview;
