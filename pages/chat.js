import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import { useState, useEffect } from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'
import {withRouter} from 'next/router';
import {ButtonSendSticker} from '../src/components/ButtonSendSticker'

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMxNjAzNCwiZXhwIjoxOTU4ODkyMDM0fQ.0-1dubrhfx9pzGj7exg3xpxX8i-H8iQDjbYcP6SHnD8'
const SUPABASE_URL = 'https://hcvvsnbriwqprhjsfyzz.supabase.co'

const supabaseClient = createClient(SUPABASE_URL,SUPABASE_KEY);

function RealTimeMenssage(adicionarMensagem){
    return supabaseClient.from('mensagens').on('INSERT',(res)=>{
        adicionarMensagem(res.new)
    }).subscribe()
}

function ChatPage(props) {
    // Sua lógica vai aqui
    const [text, setText] = useState('');
    const [listText, setListText] = useState([])
    const [username,setUsername] = useState(props.router.query.user)
   

    useEffect(() => {
        setUsername(props.router.query.user)
        supabaseClient.from('mensagens').select('*').order('id',{ascending:false}).then(({data})=>{
            setListText(data)
        })
        RealTimeMenssage((novaMensagem)=>{
            console.log(novaMensagem)
            setListText((listNow)=>{
               return [novaMensagem, ...listNow]
            })
        })
      
    },[]);

    const handleNovaMensagem = (mensagem) => {
        const novaMensagem = {
            texto: mensagem,
            de: username,
            //id: listText.length + 1
        }

        supabaseClient.from('mensagens').insert([
            novaMensagem
        ]).then(({data})=>{
            // console.log(data)
            // setListText([data[0], ...listText])
        })
        

    }

    const handleDelete = (id) =>{
        const novoList = listText.filter((mensagem) => mensagem.id != id);
        supabaseClient.from('mensagens').delete().match({id: id}).then((res)=>{
            console.log(res)
        })
        setListText(novoList)
    }

    const handleUpdate = (id) =>{
        
    }

    // ./Sua lógica vai aqui
    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary['000'],
                backgroundImage: `url(https://images.hdqwalls.com/wallpapers/bthumb/genshin-impact-game-2021-ig.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList delete={handleDelete} mensagens={listText} />

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            placeholder="Insira sua mensagem aqui..."
                            value={text}
                            onChange={(e) => {
                                setText(e.target.value);
                            }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleNovaMensagem(text);
                                    setText('')
                                }
                            }}
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <ButtonSendSticker onStickerClick={(sticker) => {
                            handleNovaMensagem(':sticker:' + sticker)
                        }}/>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}


function MessageList(props) {
    // console.log('MessageList', props);
    const [delet,setDelet] = useState(false)
    const [selectId,setSelectId] = useState();
    

    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                        onMouseEnter={(e)=>{
                            e.preventDefault();
                            setDelet(true);
                            setSelectId(mensagem.id)
                        }}
                        onMouseLeave={(e)=>{
                            e.preventDefault();
                            setDelet(false);
                            setSelectId(null)
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}
                            
                        >
                            <Box
                                styleSheet={{
                                    marginBottom: '8px',
                                    display: 'flex',
                                    flexDirection: 'row'
                                }}
                            >
                                <Image
                                    styleSheet={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        display: 'inline-block',
                                        marginRight: '8px',
                                    }}
                                    src={`https://github.com/${mensagem.de}.png`}
                                />
                                <Text tag="strong">
                                    {mensagem.de}
                                </Text>
                                <Text
                                    styleSheet={{
                                        fontSize: '10px',
                                        marginLeft: '8px',
                                        color: appConfig.theme.colors.neutrals[300],
                                    }}
                                    tag="span"
                                >
                                    {(new Date().toLocaleDateString())}
                                </Text>
                            </Box>
                            {delet && mensagem.id === selectId ? 
                            <Box styleSheet={
                                {
                                    display: 'flex',
                                    flexDirection: 'row',
                                }
                            }>
                                <Text 
                                    styleSheet={
                                        {
                                            color: appConfig.theme.colors.neutrals['200'],
                                            cursor: 'pointer',
                                            marginRight: '10px'
                                            
                                        }
                                    }
                                    onClick={(e) => {
                                        props.delete(mensagem.id)
                                    }}
                                >deletar </Text>
                                <Text styleSheet={
                                    {
                                        color: appConfig.theme.colors.neutrals['200'],
                                        cursor: 'pointer',
                                        
                                    }
                                }
                                onClick={(e) => {
                                    //props.delete(mensagem.id)
                                    
                                }}> editar</Text>
                            </Box> 
                            : null} 
                        </Box>
                         
                        {mensagem.texto.startsWith(':sticker:') ? (
                            <Image src={mensagem.texto.replace(':sticker:','')}/>
                        ) : ( mensagem.texto) }
                        
                        
                    </Text>
                )
            })}

        </Box>
    )
}

export default withRouter(ChatPage)