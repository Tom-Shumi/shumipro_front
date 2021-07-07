import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import TaskBoard from '../components/TaskBoard';
import TaskEditModal from '../components/TaskEditModal';
import TaskCommentModal from '../components/TaskCommentModal';
import {authentication, logout} from '../components/Authentication';
import dynamic from "next/dynamic";
import {Button} from 'react-bootstrap';
import { Task as TaskClass } from '../components/interface';
import {Container, Row, Col} from 'react-bootstrap';


const Task: React.FC = () => {
    // タスク作成モーダル表示フラグ
    const [taskCreateModalDispFlg, setTaskCreateModalDispFlg] = useState<Boolean>(false);
    // タスク更新モーダル表示フラグ
    const [taskUpdateModalDispFlg, setTaskUpdateModalDispFlg] = useState<Boolean>(false);
    // タスクコメントモーダル表示フラグ
    const [taskCommentModalDispFlg, setTaskCommentModalDispFlg] = useState<Boolean>(false);
    // 初期表示フラグ
    const [initDispFlg, setInitDispFlg] = useState<Boolean>(true);
    // 編集対象タスク
    const [targetTask, setTargetTaskk] = useState<TaskClass>(null);

    authentication();

    const showTaskCreateModal = (task: TaskClass) => {
        setTargetTaskk(task);
        setTaskCreateModalDispFlg(true);
    }

    const closeTaskCreateModal = () => {
        setTaskCreateModalDispFlg(false);
    }

    const showTaskUpdateModal = (task: TaskClass) => {
        setTargetTaskk(task);
        setTaskUpdateModalDispFlg(true);
    }

    const closeTaskUpdateModal = () => {
        setTaskUpdateModalDispFlg(false);
    }

    const showTaskCommentModal = (task: TaskClass) => {
        setTargetTaskk(task);
        setTaskCommentModalDispFlg(true);
    }

    const closeTaskCommentModal = () => {
        setTaskCommentModalDispFlg(false);
    }

    return (
        <Layout title="Task Board.">
            <Container>
                <Row>
                    <Col xs={4} className="margin_top_5">
                        <Button key="create" variant="primary" className="button_md" onClick={ () => showTaskCreateModal(null)}>create task</Button>
                    </Col>
                    <Col xs={8} className="div_link_right">
                        <div>
                            <Link href="/DailyTask">
                                <a> Go to Daily Task page ＞＞</a>
                            </Link>
                        </div>
                        <div className="margin_top_5">
                            <Link href="/Graph">
                                <a> Go to Weekly Tasks page ＞＞</a>
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Container>
            <TaskBoard
                initDispFlg = {initDispFlg}
                setInitDispFlg = {setInitDispFlg}
                showTaskUpdateModal = {showTaskUpdateModal}
                showTaskCommentModal = {showTaskCommentModal} />
            <br />
            <div className="div_link">
                <div className="div_link_left">
                    <a onClick={logout} href="#">＜＜ Logout</a>
                </div>
            </div>
            {taskCreateModalDispFlg && 
                <TaskEditModal 
                    close = {closeTaskCreateModal}
                    execSbt = "1"
                    setInitDispFlg = {setInitDispFlg}
                    task = {targetTask}
                />
            }
            {taskUpdateModalDispFlg && 
                <TaskEditModal 
                    close = {closeTaskUpdateModal}
                    execSbt = "2"
                    setInitDispFlg = {setInitDispFlg}
                    task = {targetTask}
                />
            }
            {taskCommentModalDispFlg && 
                <TaskCommentModal 
                    close = {closeTaskCommentModal}
                    task = {targetTask}
                />
            }
        </Layout>
    )
}

const DynamicTask = dynamic(
    {
      loader: async () => Task,
    },
    { ssr: false }
  );
  
  export default DynamicTask;