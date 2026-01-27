import sys
import ast
import json

def validate_python():
    try:
        # Read code from stdin
        code = sys.stdin.read()
        
        # Attempt to parse
        ast.parse(code)
        
        # If successful
        print(json.dumps({"isValid": True, "error": None}))
        
    except SyntaxError as e:
        error_details = {
            "line": e.lineno,
            "column": e.offset,
            "message": e.msg,
            "type": "SyntaxError"
        }
        print(json.dumps({"isValid": False, "error": error_details}))
    except Exception as e:
        # Catch other potential errors
        print(json.dumps({
            "isValid": False, 
            "error": {
                "line": 0, 
                "column": 0, 
                "message": str(e), 
                "type": "GeneralError"
            }
        }))

if __name__ == "__main__":
    validate_python()
